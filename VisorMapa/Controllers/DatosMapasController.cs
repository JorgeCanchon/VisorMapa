using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using VisorMapa.Models;

namespace VisorMapa.Controllers
{
    //Habilita cors
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DatosMapasController : ApiController
    {
        private Entities db = new Entities();

        // GET: api/DatosMapas
        [HttpGet]
       //Deshabilitar cors para este metodo [DisableCorsAttribute]
        public IHttpActionResult GetDatosMapa()
        {
            var MyUrl = Url.ToString();
            int a = db.DatosMapa.Count(x => x.IdMapa != null);
            if (a < 1 )
            {
                return StatusCode(HttpStatusCode.NoContent);
            }
            return Json(db.DatosMapa);
        }

        // GET: api/DatosMapas/5
        [HttpGet]
        public async Task<IHttpActionResult> GetDatosMapa(int id)
        {
            DatosMapa datosMapa = await db.DatosMapa.FindAsync(id);
            if (datosMapa == null)
            {
                return NotFound();
            }
            
            return Json(datosMapa);
        }

        // PUT: api/DatosMapas/5
        [HttpPut]
        public IHttpActionResult PutDatosMapa(int id,DatosMapa datosMapa)
        {
  
            if (!ModelState.IsValid)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            if (id != datosMapa.IdMapa)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }
            try
            {
                string geo = string.Format("POINT({0} {1})", datosMapa.LatCircle.ToString().Replace(',', '.'), datosMapa.LngCircle.ToString().Replace(',', '.'));

                datosMapa.Geographic = System.Data.Entity.Spatial.DbGeography.FromText(geo, 4326);
                db.EditarMapa(id, datosMapa.Nombre, datosMapa.Descripcion, datosMapa.Lat, datosMapa.Lng, datosMapa.Radio, datosMapa.Direccion, datosMapa.Geographic);
            }
            catch (Exception)
            {
                
                return StatusCode(HttpStatusCode.InternalServerError);
            }
           

            return StatusCode(HttpStatusCode.OK);
        }

        // POST: api/DatosMapas
        [HttpPost]
        public IHttpActionResult PostDatosMapa(DatosMapa datosMapa)
        {
            if (!ModelState.IsValid)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }
            try
            {
                string geo = string.Format("POINT({1} {0})", datosMapa.LngCircle.ToString().Replace(',', '.'), datosMapa.LatCircle.ToString().Replace(',', '.'));

                datosMapa.Geographic = System.Data.Entity.Spatial.DbGeography.FromText(geo,4326);

                db.InsertarMapa(datosMapa.Nombre, datosMapa.Descripcion, datosMapa.Lat, datosMapa.Lng, datosMapa.Radio, datosMapa.Direccion, datosMapa.Geographic);
            }
            catch (Exception e)
            {
                return StatusCode(HttpStatusCode.InternalServerError);
            }

            return StatusCode(HttpStatusCode.Created);
        }

        // DELETE: api/DatosMapas/5
        [HttpDelete]
        public IHttpActionResult DeleteDatosMapa(int id)
        {
            DatosMapa datosMapa = db.DatosMapa.Find(id);
            if (datosMapa == null)
            {
                return StatusCode(HttpStatusCode.Found);
            }
            try
            {
                db.EliminarDatosMapa(id);
            }
            catch (Exception)
            {
                return StatusCode(HttpStatusCode.InternalServerError);
            }
            
            return StatusCode(HttpStatusCode.OK);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DatosMapaExists(int id)
        {
            return db.DatosMapa.Count(e => e.IdMapa == id) > 0;
        }
    }
}