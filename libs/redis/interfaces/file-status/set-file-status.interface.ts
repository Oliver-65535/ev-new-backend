export interface ISetFileStatusInput {
  ownerId:number;
  articleId:number;
  status: string;
  progressPercent: string;
  timestamp: number; 
}
