import { ApiProperty } from '@nestjs/swagger';

class Meta {
  @ApiProperty()
  spans: number[][];
}

export class GraphArray {
  @ApiProperty()
  head: string;

  @ApiProperty()
  meta: Meta;

  @ApiProperty()
  tail: string;

  @ApiProperty()
  type: string;
}

export class CChangeGraph {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: [GraphArray] })
  graph: GraphArray[];
}
