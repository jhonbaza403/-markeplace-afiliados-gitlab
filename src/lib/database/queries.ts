// ==========================================================
// Database Query Helpers
// ==========================================================


export function paginationQuery(
 page:number,
 limit:number
){

 return {

  from:
   (page - 1)
   *
   limit,


  to:
   page *
   limit - 1

 };

}
