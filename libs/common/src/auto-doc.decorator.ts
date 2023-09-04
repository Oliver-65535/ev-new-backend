import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiResponseOptions,
  ApiOperationOptions,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';

import { ErrorResponse } from './error.response';
import { SuccessResponse } from './success.response';

export const ApiOkResponseCustom = <DataDto extends Type<unknown>>(
  dataDto: DataDto | [DataDto],
  description = 'Successful response',
) => {
  const dto = typeof dataDto === 'function' ? dataDto : dataDto[0];

  return applyDecorators(
    ApiExtraModels(SuccessResponse, dto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponse) },
          {
            properties: {
              data:
                typeof dataDto === 'function'
                  ? {
                      type: 'object',
                      $ref: getSchemaPath(dto),
                    }
                  : {
                      type: 'array',
                      items: { $ref: getSchemaPath(dto) },
                    },
            },
          },
        ],
      },
      description,
    }),
  );
};

export interface CommonOptions {
  bearerAuth?: boolean;
  cookieAuth?: boolean;
  apiTags?: string;
  [HttpStatus.INTERNAL_SERVER_ERROR]?: string | boolean;
  [HttpStatus.NOT_FOUND]?: string | boolean;
  [HttpStatus.FORBIDDEN]?: string | boolean;
  [HttpStatus.UNAUTHORIZED]?: string | boolean;
  [HttpStatus.BAD_REQUEST]?: string | boolean;
}

export interface Options extends CommonOptions {
  apiOperation?: ApiOperationOptions | string;
  [HttpStatus.OK]?: ApiResponseOptions | string | unknown;
}

export interface AutoDocControllerOptions extends CommonOptions {}

export function AutoDocController(options: AutoDocControllerOptions) {
  const decorators: Array<
    ClassDecorator | MethodDecorator | PropertyDecorator
  > = autoDocCommon([], options);

  if (options.apiTags) decorators.push(ApiTags(options.apiTags));

  return applyDecorators(...decorators);
}

export function AutoDoc(options: Options) {
  const decorators: Array<
    ClassDecorator | MethodDecorator | PropertyDecorator
  > = autoDocCommon([], options);
  if (options[HttpStatus.OK]) {
    if (typeof options[HttpStatus.OK] === 'string') {
      decorators.push(
        ApiOkResponse({
          description: options[HttpStatus.OK] as string,
          type: SuccessResponse,
        }),
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { type, ...opt } = options[HttpStatus.OK];

      if (!type && opt.description) {
        decorators.push(
          ApiOkResponse({
            description: opt.description,
            type: SuccessResponse,
          }),
        );
      } else if (type && opt.description) {
        decorators.push(ApiOkResponseCustom(type, opt.description));
      } else if (type && !opt.description) {
        decorators.push(ApiOkResponseCustom(type));
      } else {
        throw new Error('Provide type or description');
      }
    }

    if (options.apiOperation) {
      const opt: ApiOperationOptions =
        typeof options.apiOperation === 'string'
          ? { summary: options.apiOperation }
          : options.apiOperation;

      decorators.push(ApiOperation(opt));
    }

    return applyDecorators(...decorators);
  }
}

function autoDocCommon(
  decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [],
  options: CommonOptions,
): Array<ClassDecorator | MethodDecorator | PropertyDecorator> {
  if (options[HttpStatus.INTERNAL_SERVER_ERROR])
    decorators.push(
      ApiInternalServerErrorResponse(
        setError(options[HttpStatus.INTERNAL_SERVER_ERROR]),
      ),
    );
  if (options[HttpStatus.NOT_FOUND])
    decorators.push(
      ApiNotFoundResponse(setError(options[HttpStatus.NOT_FOUND])),
    );

  if (options[HttpStatus.FORBIDDEN])
    decorators.push(
      ApiForbiddenResponse(setError(options[HttpStatus.FORBIDDEN])),
    );

  if (options[HttpStatus.UNAUTHORIZED])
    decorators.push(
      ApiUnauthorizedResponse(setError(options[HttpStatus.UNAUTHORIZED])),
    );

  if (options[HttpStatus.BAD_REQUEST])
    decorators.push(
      ApiBadRequestResponse(setError(options[HttpStatus.BAD_REQUEST])),
    );

  if (options.bearerAuth) decorators.push(ApiBearerAuth());
  if (options.cookieAuth) decorators.push(ApiCookieAuth());

  return decorators;
}

function setError(description: string | boolean) {
  const opt: ApiResponseOptions = { type: ErrorResponse };
  if (typeof description === 'string') opt.description = description;
  return opt;
}
