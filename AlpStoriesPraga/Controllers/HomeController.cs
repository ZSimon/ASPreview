using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Spire.Pdf;

namespace AlpStoriesPraga.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet, ValidateInput(false)]
        public String CreatePdf()
        {
            int lineCount = 0;
            System.Text.StringBuilder output = new System.Text.StringBuilder();
            String exportPath = ConfigurationManager.AppSettings["JpgToPdfDir"];

            String pdfName = "test";
            String url = @"d:\My Projects\AlpStoriesPraga\AlpStoriesPraga\Content\UserTemplates\LabelImg\mymkwwd44kkcrydvo3exehfx_3.jpg";
            var p = new System.Diagnostics.Process();
            p.StartInfo.Arguments = "\""+ url + "\" test";
            p.StartInfo.FileName = ConfigurationManager.AppSettings["JpgToPdfScript"];
            p.StartInfo.CreateNoWindow = true;
            p.StartInfo.UseShellExecute = false; // needs to be false in order to redirect output
            p.StartInfo.RedirectStandardOutput = true;
            p.StartInfo.RedirectStandardError = true;
            p.StartInfo.RedirectStandardInput = true;
            p.StartInfo.WorkingDirectory = exportPath;

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

            return "done";
        }

        [HttpGet, ValidateInput(false)]
        public String test()
        {
            //PdfDocument originalDoc = new PdfDocument();
            //originalDoc.LoadFromFile(@"d:\PdfLabel\14caa000e89ce532.pdf");

            //PdfNewDocument newDoc = new PdfNewDocument();
            //newDoc.Conformance = PdfConformanceLevel.Pdf_A1B;
            //PdfPageBase page = originalDoc.Pages[0];
            //float pageWidth = page.Size.Width + originalDoc.PageSettings.Margins.Left + originalDoc.PageSettings.Margins.Right;
            //float pageHeight = page.Size.Height + originalDoc.PageSettings.Margins.Top + originalDoc.PageSettings.Margins.Bottom;

            //PdfPageBase p = newDoc.Pages.Add(new SizeF(pageWidth, pageHeight));
            //page.CreateTemplate().Draw(p, 0, 0);

            //foreach (PdfPageBase page in originalDoc.Pages)
            //{
            //    float pageWidth = page.Size.Width + originalDoc.PageSettings.Margins.Left + originalDoc.PageSettings.Margins.Right;
            //    float pageHeight = page.Size.Height + originalDoc.PageSettings.Margins.Top + originalDoc.PageSettings.Margins.Bottom;
            //    PdfPageBase p = newDoc.Pages.Add(new SizeF(pageWidth, pageHeight));
            //    page.CreateTemplate().Draw(p, 0, 0);
            //}

            //newDoc.Save(@"d:\PdfLabel\result.pdf");

            return "done";
        }
    }
}