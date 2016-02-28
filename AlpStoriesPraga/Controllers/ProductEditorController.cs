using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AlpStoriesPraga.Models;
using System.Data.SqlClient;
using System.Configuration;
using Dapper;
using System.Data;
using Newtonsoft.Json;
using System.Diagnostics;

namespace AlpStoriesPraga.Controllers
{
    public class ProductEditorController : Controller
    {
        // GET: ProductEditor
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult createProduct(String productId, Decimal scent_q)
        {
            /*read price, svg and save to disk!*/
            //read template from session!)
            var cs = ConfigurationManager.ConnectionStrings["alpStories"].ConnectionString;
            Int32 scLevel;
            Decimal price;
            String template, folder, pdfName="", exportPath="";

            try
            {
                using (SqlConnection conn = new SqlConnection(cs))
                {
                    using (SqlCommand cmd = new SqlCommand("dbo.p_getPdfData", conn))
                    {
                        conn.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@product_id", SqlDbType.NVarChar, 50).Value = productId;
                        cmd.Parameters.Add("@scent_q", SqlDbType.Float).Value =scent_q;
                        SqlDataReader rdr;
                        rdr = cmd.ExecuteReader();
                        rdr.Read();
                        scLevel = rdr.GetInt32(0);
                        price = rdr.GetDecimal(1);
                        template = rdr.GetString(2);
                        rdr.Close();
                        System.Web.HttpContext.Current.Session.Contents["price"]=price;
                    }
                }
                Int32 custom = (Int32)System.Web.HttpContext.Current.Session["custom"];

                if (custom==1)
                {
                    if (System.Web.HttpContext.Current.Session["imgName"] != null)
                    {
                        template = System.Web.HttpContext.Current.Session.SessionID + ".svg";
                        folder = "?folder=UserTemplates";
                    }
                    else
                        folder = "?folder=ASTemplates";
                    //create pdf
                    int lineCount = 0;
                    System.Text.StringBuilder output = new System.Text.StringBuilder();

                    //string imageName = ConfigurationManager.AppSettings["ExportFilePath"] + outputFilename + ".jpg";
                    string url = ConfigurationManager.AppSettings["UrlPdfPath"];
                    url += folder + "&id=" + template.Split('/').Last();
                    url = url.Substring(0, url.Length - 4);
                    url = url + "&productId=" + productId;
                    var p = new System.Diagnostics.Process();
                    p.StartInfo.FileName = ConfigurationManager.AppSettings["HtmlToPdfExePath"];
                    //".\wkhtmltox\bin\wkhtmltopdf.exe" -T 0 -B 0 -L 0 -R 0  --page-width 96 --page-height 66 --dpi 300 --enable-javascript "http://localhost/AlpStoriesPraga/labelEditor/template/?folder=userTemplates&id=HP_girl_3" "d:\Temp\zd\wkhtml\wkhtmltox\test\test2.pdf"
                    pdfName = GenerateId() + ".pdf";
                    exportPath = ConfigurationManager.AppSettings["ExportPdfPath"];
                    
                    if (System.Web.HttpContext.Current.Session["dimension"].ToString() == "3")
                        p.StartInfo.Arguments = "--margin-top 0 --margin-bottom 0 --margin-left 0 --margin-right 0 --page-width 96mm --page-height 65mm --print-media-type --dpi 200 --enable-javascript " + url + " " + pdfName;
                    else
                        p.StartInfo.Arguments = "-T 0 -B 0 -L 0 -R 0  --page-width 150 --page-height 125 --print-media-type --dpi 300 --enable-javascript " + url + " " + pdfName;

                    p.StartInfo.CreateNoWindow = true;
                    p.StartInfo.UseShellExecute = false; // needs to be false in order to redirect output
                    p.StartInfo.RedirectStandardOutput = true;
                    p.StartInfo.RedirectStandardError = true;
                    p.StartInfo.RedirectStandardInput = true;
                    p.StartInfo.WorkingDirectory = exportPath;

                    //p.OutputDataReceived += (object sender, DataReceivedEventArgs e) => error=e.Data;
                    p.OutputDataReceived += new DataReceivedEventHandler((sender, e) =>
                    {
                        // Prepend line numbers to each line of the output.
                        if (!String.IsNullOrEmpty(e.Data))
                        {
                            lineCount++;
                            output.Append("\n[" + lineCount + "]: " + e.Data);
                        }
                    });

                    p.ErrorDataReceived += new DataReceivedEventHandler((sender, e) =>
                    {
                        // Prepend line numbers to each line of the output.
                        if (!String.IsNullOrEmpty(e.Data))
                        {
                            lineCount++;
                            output.Append("\n[" + lineCount + "]: " + e.Data);
                        }
                    });

                    p.Start();
                    p.BeginOutputReadLine();
                    p.BeginErrorReadLine();
                    p.WaitForExit();

                    if (p.ExitCode != 0)
                        throw new Exception(output.ToString());

                    p.Close();
                }//custom
                    

                using (SqlConnection conn = new SqlConnection(cs))
                {
                    using (SqlCommand cmd = new SqlCommand("dbo.p_generateOrder", conn))
                    {
                        conn.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@product_id", SqlDbType.NVarChar, 50).Value = productId;
                        cmd.Parameters.Add("@scLevel", SqlDbType.Float).Value = scLevel;
                        if (custom == 1)
                            cmd.Parameters.Add("@filePath", SqlDbType.NVarChar, 500).Value = exportPath + pdfName;
                        else
                            cmd.Parameters.Add("@filePath", SqlDbType.NVarChar, 500);

                        cmd.ExecuteNonQuery();
                        System.Web.HttpContext.Current.Session["imgName"] = null;
                    }
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, msg="Product created." }, JsonRequestBehavior.AllowGet);
        }

        private string GenerateId()
        {
            long i = 1;
            foreach (byte b in Guid.NewGuid().ToByteArray())
            {
                i *= ((int)b + 1);
            }
            return string.Format("{0:x}", i - DateTime.Now.Ticks);
        }


        [HttpGet]
        public JsonResult getIngredients(String productId, String quantity){
            var cs = ConfigurationManager.ConnectionStrings["alpStories"].ConnectionString;
            System.Web.HttpContext.Current.Session["custom"] = 0;
            /*nekje je napaka, sem dal začasno*/
            if(productId.IndexOf("_")!=-1)
            {
                productId=productId.Substring(productId.IndexOf('_') + 1);
            }
            if (quantity != "0")
            {
                using (SqlConnection conn = new SqlConnection(cs))
                {
                    using (SqlCommand cmd = new SqlCommand("dbo.p_checkSize", conn))
                    {
                        conn.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@product_id", SqlDbType.NVarChar, 50).Value = productId;
                        cmd.Parameters.Add("@quantity", SqlDbType.Int).Value = Convert.ToInt32(quantity);
                        cmd.Parameters.Add("@product_idR", SqlDbType.NVarChar, 50).Direction = ParameterDirection.Output;
                        cmd.Parameters.Add("@size", SqlDbType.Int).Direction = ParameterDirection.Output;
                        cmd.ExecuteNonQuery();

                        System.Web.HttpContext.Current.Session["dimension"] = cmd.Parameters["@size"].Value;
                        productId = cmd.Parameters["@product_idR"].Value.ToString();
                    }
                }
            }
            else
                System.Web.HttpContext.Current.Session["dimension"] = 1;
            //var products = new List<ProductEditorModel.Product>();
            ProductEditorModel.Product prod=null;
            System.Web.HttpContext.Current.Session["productId"] = productId;

            System.Web.HttpContext.Current.Session["imgName"] = null;

            using (SqlConnection conn = new SqlConnection(cs))
            {
                conn.Query<ProductEditorModel.Product, ProductEditorModel.Ingredient, ProductEditorModel.Item, bool>("dbo.p_getIngredients",
                    (product, ingredient, item) =>
                    {
                        /*
                        ProductEditorModel.Product prod = products.Where(p => p.Id == product.Id).SingleOrDefault();
                        if (prod == null)
                        {
                            products.Add(product);
                            prod = product;
                        }
                        */
                        /*vedno je samo eden*/
                        if (prod == null)
                        {
                            prod = product;
                        }

                        if (prod.ingredients == null)
                            prod.ingredients = new List<ProductEditorModel.Ingredient>();

                        ProductEditorModel.Ingredient ing = prod.ingredients.Where(c => c.category_id == ingredient.category_id).FirstOrDefault();
                        if (ing == null)
                        {
                            prod.ingredients.Add(ingredient);
                            ing = ingredient;
                        }

                        if (ing.items == null)
                        {
                            ing.items = new List<ProductEditorModel.Item>();
                        }

                        if (!ing.items.Any(i => i.ingredient_id == item.ingredient_id))
                        {
                            ing.items.Add(item);
                        }
                        
                        return true;
                    }, new { productID = productId }, commandType: CommandType.StoredProcedure, splitOn: "category_id, ingredient_id");
            }
            
            //return "{ success = true, ingredients = " + Newtonsoft.Json.JsonConvert.SerializeObject(prod) + "}";
            
            //return Json(JsonConvert.SerializeObject(prod), JsonRequestBehavior.AllowGet);

            //return Json(prod, JsonRequestBehavior.AllowGet);
            System.Web.HttpContext.Current.Session["imgName"] = null;
            return Json(new { success = true, data = prod }, JsonRequestBehavior.AllowGet);

        }
    }
}