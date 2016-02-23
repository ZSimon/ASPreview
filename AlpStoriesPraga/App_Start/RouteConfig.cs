using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AlpStoriesPraga
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            /*velja za vse metode controlerjev, da je id opcijski
             če hočeš kakšno drugače, daš namesto {controller} ime kontrolerja, recimo "Template"
             vrstni red je pomemben, prvega, ko najde, gre tja
             */
            routes.MapRoute(
                name: "LabelEditor",
                url: "LabelEditor/{action}/{productId}",
                defaults: new { controller = "LabelEditor", action = "Label", productId = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "ProductEditor",
                url: "ProductEditor/{action}/{productId}",
                defaults: new { controller = "ProductEditor", action = "Index", productId = UrlParameter.Optional }
            );
            
            /*
            routes.MapRoute(
                name: "Praga",
                url: "Praga/{action}/{id}",
                defaults: new { controller = "Praga", action = "Praga", id = UrlParameter.Optional }
            );
            */
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
            
        }
    }
}
