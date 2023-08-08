export class Error {
      
      public constructor(public message:string,public status:number){}

}

export class RouteNotFoundError extends Error{

      public constructor(route:string){
            super(`Route ${route} is not exists`, 404);
      }
}

export class ResourceNotFoundError extends Error{

      public constructor(id:number){
            super(`Id ${id} is not exists`, 404);
      }
}

export class ValidationError extends Error{

      public constructor(message:string){
            super(message, 400);
      }
}

export class UnAuthorizedError extends Error {
      public constructor(message:string){
            super(message, 401);
      }
}

