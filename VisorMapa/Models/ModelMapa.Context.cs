//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace VisorMapa.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;

    public partial class Entities : DbContext
    {
        public Entities()
            : base("name=Entities")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }

        public virtual DbSet<DatosMapa> DatosMapa { get; set; }

        public virtual int EditarMapa(Nullable<int> id, string nombre, string descripcion, Nullable<double> lat, Nullable<double> lng, Nullable<short> radio, string direccion, System.Data.Entity.Spatial.DbGeography geographic)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("id", id) :
                new ObjectParameter("id", typeof(int));

            var nombreParameter = nombre != null ?
                new ObjectParameter("nombre", nombre) :
                new ObjectParameter("nombre", typeof(string));

            var descripcionParameter = descripcion != null ?
                new ObjectParameter("descripcion", descripcion) :
                new ObjectParameter("descripcion", typeof(string));

            var latParameter = lat.HasValue ?
                new ObjectParameter("lat", lat) :
                new ObjectParameter("lat", typeof(double));

            var lngParameter = lng.HasValue ?
                new ObjectParameter("lng", lng) :
                new ObjectParameter("lng", typeof(double));

            var radioParameter = radio.HasValue ?
                new ObjectParameter("radio", radio) :
                new ObjectParameter("radio", typeof(short));

            var direccionParameter = direccion != null ?
                new ObjectParameter("direccion", direccion) :
                new ObjectParameter("direccion", typeof(string));

            var geographicParameter = geographic != null ?
                new ObjectParameter("geographic", geographic) :
                new ObjectParameter("geographic", typeof(System.Data.Entity.Spatial.DbGeography));

            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("EditarMapa", idParameter, nombreParameter, descripcionParameter, latParameter, lngParameter, radioParameter, direccionParameter, geographicParameter);
        }

        public virtual int EliminarDatosMapa(Nullable<int> id)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("Id", id) :
                new ObjectParameter("Id", typeof(int));

            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("EliminarDatosMapa", idParameter);
        }

        public virtual int InsertarMapa(string nombre, string descripcion, Nullable<double> lat, Nullable<double> lng, Nullable<short> radio, string direccion, System.Data.Entity.Spatial.DbGeography geographic)
        {
            var nombreParameter = nombre != null ?
                new ObjectParameter("Nombre", nombre) :
                new ObjectParameter("Nombre", typeof(string));

            var descripcionParameter = descripcion != null ?
                new ObjectParameter("Descripcion", descripcion) :
                new ObjectParameter("Descripcion", typeof(string));

            var latParameter = lat.HasValue ?
                new ObjectParameter("Lat", lat) :
                new ObjectParameter("Lat", typeof(double));

            var lngParameter = lng.HasValue ?
                new ObjectParameter("Lng", lng) :
                new ObjectParameter("Lng", typeof(double));

            var radioParameter = radio.HasValue ?
                new ObjectParameter("Radio", radio) :
                new ObjectParameter("Radio", typeof(short));

            var direccionParameter = direccion != null ?
                new ObjectParameter("Direccion", direccion) :
                new ObjectParameter("Direccion", typeof(string));

            var geographicParameter = geographic != null ?
                new ObjectParameter("Geographic", geographic) :
                new ObjectParameter("Geographic", typeof(System.Data.Entity.Spatial.DbGeography));

            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertarMapa", nombreParameter, descripcionParameter, latParameter, lngParameter, radioParameter, direccionParameter, geographicParameter);
        }
    }
}