class Apiresponse{
    constructor(statusCode,data,message='Success'){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode < 400
    }
}
export{Apiresponse}
// /////////class ApiResponse<T> {
//   public statusCode: number;
//   public data: T | null;
//   public message: string;
//   public success: boolean;
//   constructor(statusCode: number, data: T | null, message: string = "Success") {
//     this.statusCode = statusCode;
//     this.data = data;
//     this.message = message;
//     this.success = statusCode < 400; // 2xx and 3xx => true, otherwise false
//   }
//   }
// export { ApiResponse };
