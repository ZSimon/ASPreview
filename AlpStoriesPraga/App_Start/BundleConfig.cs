using System.IO;
using System.Web;
using System.Web.Optimization;
using System.Collections.Generic;

namespace AlpStoriesPraga
{
    class PassthruBundleOrderer : IBundleOrderer
    {
        public IEnumerable<BundleFile> OrderFiles(BundleContext context, IEnumerable<BundleFile> files)
        {
            return files;
        }
    }

    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));
            
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/css/bootstrap.min.css",
                      "~/Content/css/spectrum.min.css",
                      "~/Content/css/labelEditor.css"
                      ));

            bundles.Add(new StyleBundle("~/CntHome/css").Include(
                      "~/Content/css/bootstrap.min.css",
                      "~/Content/css/labelEditor.css"
                      ));

            bundles.Add(new ScriptBundle("~/CntHome/script").Include(
                      "~/Scripts/jquery.min.js",
                      "~/Scripts/bootstrap.min.js"
            ));

            bundles.Add(new StyleBundle("~/CntPraga/css").Include(
                     "~/Content/css/bootstrap.min.css",
                      "~/Content/css/spectrum.min.css",
                      "~/Content/css/labelEditor.css",
                      "~/Content/css/bootstrapNew.min.css",
                      "~/Content/css/eSalon.css",
                      "~/Content/css/productEditor.css",
                       "~/Content/css/entryPage.css"
                      ));
            /*
            var pragaScript = new Bundle("~/CntPraga/script");
            //pragaScript.Orderer = new AsIsBundleOrderer();

            pragaScript
                .Include("~/Scripts/jquery.min.js")
                .Include("~/Scripts/load-image.all.min.js")
                .Include("~/Scripts/bootstrap.min.js")
                .Include("~/Scripts/TweenLite.min.js")
                .Include("~/Scripts/Draggable.min.js")
                .Include("~/Scripts/CSSPlugin.min.js")
                .Include("~/Scripts/main.js")
                .Include("~/Scripts/jquery-1.11.3.min.js")
                .Include("~/Scripts/perfect-scrollbar.jquery.min.js")
                .Include("~/Scripts/jquery.knob.js")
                .Include("~/Scripts/d3.min.js")
                .Include("~/Scripts/productEditor.js")
                .Include("~/Scripts/entryPage.js");

            bundles.Add(pragaScript);
            */
            var pragaScript=new ScriptBundle("~/CntPraga/script").Include(
                      "~/Scripts/jquery.min.js",
                      "~/Scripts/load-image.all.min.js",
                      "~/Scripts/bootstrap.min.js",
                      "~/Scripts/TweenLite.min.js",
                      "~/Scripts/Draggable.min.js",
                      "~/Scripts/CSSPlugin.min.js",
                      "~/Scripts/labelEditor.js",
                      "~/Scripts/jquery-1.11.3.min.js",
                      "~/Scripts/jquery.base64.js",
                      "~/Scripts/perfect-scrollbar.jquery.min.js",
                      "~/Scripts/jquery.knob.js",
                      "~/Scripts/d3.min.js",
                      "~/Scripts/productEditor.js",
                      "~/Scripts/entryPage.js"
            );

            pragaScript.Orderer = new PassthruBundleOrderer();
            bundles.Add(pragaScript);

            bundles.Add(new ScriptBundle("~/LblEdt/script").Include(
                      "~/Scripts/jquery.min.js",
                      "~/Scripts/load-image.all.min.js",
                      "~/Scripts/bootstrap.min.js",
                      "~/Scripts/TweenLite.min.js",
                      "~/Scripts/Draggable.min.js",
                      "~/Scripts/CSSPlugin.min.js",
                      "~/Scripts/labelEditor.js"
            ));

            bundles.Add(new StyleBundle("~/Content/template").Include("~/Content/css/template.css"));

            bundles.Add(new ScriptBundle("~/bundles/template").Include("~/Scripts/jquery.min.js"));
        }
    }
}
