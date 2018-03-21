using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace VisorMapa
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Configuración y servicios de API web
            //Politica de origen Install-Package Microsoft.AspNet.WebApi.Cors
            config.EnableCors();
            
            // Rutas de API web
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "services/{controller}/{Action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.MessageHandlers.Add(new Handlers.ValidationHandle());
        }
    }
}
