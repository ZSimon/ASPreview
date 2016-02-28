using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Dapper;
using AlpStoriesPraga.Models;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.IO;
using SelectPdf;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Text.RegularExpressions;
using HtmlAgilityPack;

namespace AlpStoriesPraga.Controllers
{
    public class LabelEditorController : Controller
    {
        public ActionResult Label()
        {
            return View();
        }

        

        [HttpPost, ValidateInput(false)]
        public JsonResult saveLabel(string productId, string svg)
        {
            //HtmlDocument htmlDocument = new HtmlDocument();
            //htmlDocument.LoadHtml(svg);
            //foreach (var descendant in htmlDocument.DocumentNode.Descendants("metadata").ToList())
            //    descendant.Remove();
            Int32 startIndex = svg.IndexOf("<metadata", StringComparison.Ordinal);

            if (startIndex != -1) {
                var strToRemove = svg.Substring(startIndex, svg.IndexOf("</metadata>", StringComparison.Ordinal) - startIndex + 11);
                svg = svg.Replace(strToRemove, "");
            }
            //svg = htmlDocument.DocumentNode.OuterHtml;

            //svg=Regex.Replace(svg, @"(\</?metadata(.*?)/?\>)", string.Empty, RegexOptions.IgnoreCase);
            //var svg1 = Regex.Replace(svg, @"<*metadata>", String.Empty, RegexOptions.IgnoreCase);
            String dimension;
            System.Web.HttpContext.Current.Session["custom"] = 1;
            if (System.Web.HttpContext.Current.Session["dimension"] == null)
            {
                var cs = ConfigurationManager.ConnectionStrings["alpStories"].ConnectionString;
                using (SqlConnection conn = new SqlConnection(cs))
                {
                    using (SqlCommand cmd = new SqlCommand("dbo.p_getDimension", conn))
                    {
                        conn.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@product_id", SqlDbType.NVarChar, 50).Value = productId;
                        cmd.Parameters.Add("@dimension", SqlDbType.Int).Direction = ParameterDirection.Output;
                        cmd.ExecuteNonQuery();
                        dimension = cmd.Parameters["@dimension"].Value.ToString();

                        System.Web.HttpContext.Current.Session["dimension"] = dimension;
                    }
                }
            }
            else
                dimension = System.Web.HttpContext.Current.Session["dimension"].ToString();


            String fileName=System.Web.HttpContext.Current.Session.SessionID + ".svg";
            /*
            if(dimension=="3")
                fileName=System.Web.HttpContext.Current.Session.SessionID + ".svg";
            else
                fileName=System.Web.HttpContext.Current.Session.SessionID + ".svg";
            */
            String filePath = Server.MapPath("~") + @"\Content\UserTemplates\" + fileName;
            String imgName = "";
            System.Web.HttpContext.Current.Session["productId"] = productId;
            /*
            //if I would have base64 encoded
            byte[] data = Convert.FromBase64String(svg);

            System.IO.FileStream _FileStream = new System.IO.FileStream(filePath, System.IO.FileMode.Create, System.IO.FileAccess.Write);
            _FileStream.Write(data, 0, data.Length);
            // close file stream
            _FileStream.Close();
           */

            StreamWriter svgFile = new StreamWriter(filePath, false);
            svgFile.WriteLine(svg);
            svgFile.Close();
            svgFile.Dispose();

            /*create image*/
            int lineCount = 0;
            System.Text.StringBuilder output = new System.Text.StringBuilder();

            string url = ConfigurationManager.AppSettings["UrlImagePath"];
            url += "&id=" + System.Web.HttpContext.Current.Session.SessionID + "&productId=" + productId;

            var p = new System.Diagnostics.Process();
            p.StartInfo.FileName = ConfigurationManager.AppSettings["HtmlToImageExePath"];

            if (dimension == "3")
            {
                imgName = System.Web.HttpContext.Current.Session.SessionID + "_3.jpg";
                p.StartInfo.Arguments = "--width 1134 " + url + " " + imgName;
            }
            else
            {
                imgName = System.Web.HttpContext.Current.Session.SessionID + "_1.jpg";
                p.StartInfo.Arguments = "--width 1784 " + url + " " + imgName;
            }

            System.Web.HttpContext.Current.Session["imgName"] = @"../" + ConfigurationManager.AppSettings["ExportImagePath"] + imgName;
            String exportPath = Server.MapPath("~") + ConfigurationManager.AppSettings["ExportImagePath"];

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

            return Json(new { success = true, msg = svg }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getLabel(string productId)
        {
            String label = "";

            if (System.Web.HttpContext.Current.Session["productId"] != null)
            {
                if (System.Web.HttpContext.Current.Session["productId"].ToString() != productId)
                    System.Web.HttpContext.Current.Session["imgName"] = null;
            }
            if (System.Web.HttpContext.Current.Session["imgName"] == null)
            {
                if (System.Web.HttpContext.Current.Session.Contents["label" + productId] == null)
                {
                    var cs = ConfigurationManager.ConnectionStrings["alpStories"].ConnectionString;
                    using (SqlConnection conn = new SqlConnection(cs))
                    {
                        using (SqlCommand cmd = new SqlCommand("dbo.p_getDefaultImage", conn))
                        {
                            conn.Open();
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.Add("@product_id", SqlDbType.NVarChar, 50).Value = productId;
                            SqlDataReader rdr;
                            rdr = cmd.ExecuteReader();
                            rdr.Read();
                            label = rdr.GetString(0);
                            rdr.Close();
                            cmd.ExecuteNonQuery();
                        }
                    }

                    label = label.Replace("ASTemplates", "TemplatesImg");
                    label = label.Replace(".svg", ".jpg");
                    System.Web.HttpContext.Current.Session.Contents["label" + productId] = label;
                }
                else
                    label = System.Web.HttpContext.Current.Session.Contents["label" + productId].ToString();

            }
            else
            {
                label=System.Web.HttpContext.Current.Session["imgName"].ToString();
            }
            return Json(new { success = true, msg = label }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public String createPdf()
        {
            string url = "http://localhost/AlpStoriesPraga/labelEditor/template/HP_girl_3";

            int webPageWidth = 1134;
          

            // instantiate a html to pdf converter object
            HtmlToPdf converter = new HtmlToPdf();
            PdfPageSize pageSize = PdfPageSize.Custom;
            SizeF sz = new SizeF(100, 100);
            converter.Options.PdfPageSize = pageSize;
            converter.Options.PdfPageCustomSize = sz;
            // set converter options
            
            //converter.Options.PdfPageOrientation=;
            converter.Options.WebPageWidth = webPageWidth;
            //converter.Options.WebPageHeight = webPageHeight;

            //HtmlToPdf converter = new HtmlToPdf();
            //converter.Options.WebPageWidth = 96;
            //converter.Options.WebPageHeight = 65;
            converter.Options.MarginTop = 0;
            converter.Options.MarginLeft = 0;
 
            PdfDocument doc = converter.ConvertUrl(url);
            doc.Save(@"d:\Temp\test1.pdf");

            // close pdf document
            doc.Close();

            return "test";
        }

        [HttpGet]
        public JsonResult labelTemplate(String productId)
        {
            LabelModel.product product;
            var cs = ConfigurationManager.ConnectionStrings["alpStories"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(cs))
            {
                product = conn.Query<LabelModel.product>("dbo.p_getLabel", new { productID = productId },
                 commandType: CommandType.StoredProcedure).FirstOrDefault();
            }
            
            return Json(new { success = true, msg = "", template = product }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getTemplates(String dimension)
        {
            List<string> templates = new List<string>();
            string folderPath = Server.MapPath("~") + @"\Content\Templates\";
            
            foreach (string file in Directory.EnumerateFiles(folderPath, "*"+dimension+".svg"))
            {
                templates.Add(@"../Content/Templates/"+Path.GetFileName(file));
            }
            return Json(new { success = true, msg = "", templates = templates }, JsonRequestBehavior.AllowGet);
        }
       
        [HttpPost]
        public JsonResult UploadImage(string ProductId)
        {
            var httpPostedFile = System.Web.HttpContext.Current.Request.Files[0];
            if (httpPostedFile != null)
            {
                // Get the complete file path
                /*add product + session and delete all other images*/
                //var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/UploadedFiles"), httpPostedFile.FileName);
                String fileName = System.Web.HttpContext.Current.Session.SessionID + '_'+ httpPostedFile.FileName;
                String filePath = Server.MapPath("~") + @"\Content\UserTemplates\Img\" + fileName;

                // Save the uploaded file to "UploadedFiles" folder
                httpPostedFile.SaveAs(filePath);
                String url = "http://"+Request.Url.Host + Url.Content("~/") + @"Content/UserTemplates/Img/" + fileName;
                return Json(new { success = true, msg = url });
            }
            else
                return Json(new { success = false, msg = "No file for upload!" });
            
        }
        
        [HttpPost]
        public JsonResult UploadImage_org(String ProductId, String bImage)
        {
            String fileName = Server.MapPath("~")+@"\Content\UserTemplates\Img\"+ProductId+".jpg";
            byte[] bytes = Convert.FromBase64String(bImage);
            Image image;
            using (MemoryStream ms = new MemoryStream(bytes))
            {
                image = Image.FromStream(ms);
            }
            image.Save(fileName, System.Drawing.Imaging.ImageFormat.Jpeg);

            return Json(new { success = true, msg = "", data = "" });
        }

        public ActionResult Template(String folder, String id, String productId)
        {
            //id.Replace("")
            ViewBag.Template = Url.Content("~/") + @"Content/" + folder +@"/" + id + ".svg";
            ViewBag.ProductId = productId;
            String dimension = "1";
            var cs = ConfigurationManager.ConnectionStrings["alpStories"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(cs))
            {
                using (SqlCommand cmd = new SqlCommand("dbo.p_getDimension", conn))
                {
                    conn.Open();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@product_id", SqlDbType.NVarChar, 50).Value = productId;
                    cmd.Parameters.Add("@dimension", SqlDbType.Int).Direction = ParameterDirection.Output;
                    cmd.ExecuteNonQuery();
                    dimension = cmd.Parameters["@dimension"].Value.ToString();
                }
            }

            if (dimension == "1")
            {
                ViewBag.css = "cs1";
                ViewBag.bottleSize = "1";
            }
            else
            {
                ViewBag.css = "cs3";
                ViewBag.bottleSize = "3";
            }
            return View();
        }
    }
}