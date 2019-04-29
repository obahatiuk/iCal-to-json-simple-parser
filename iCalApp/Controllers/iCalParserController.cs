using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace iCalApp.Controllers
{
    [Route("parsing")]
    [ApiController]
    public class iCalParserController : ControllerBase
    {
        [HttpPost("file-to-json"), HttpGet("file-to-json")]
        public IActionResult ConvertiCalFileToSimpleJson()
        {
            //var filesToProvide =  Request.Body;
            var files = Request.Form.Files;

            if (files.Count == 0)
                return new BadRequestResult();

            using (StreamReader file = new StreamReader(files[0].OpenReadStream()))
            {
                var content = "";
                string ln = "";

                while ((ln = file.ReadLine()) != null)
                {
                    content += ln + "\n";
                }

                Parser parser = new Parser(content);

                var result = parser.parseCalendar();

                return new JsonResult(result);
            }
        }

        [HttpPost("json"), HttpGet("json")]
        public IActionResult ConvertiCalTextToSimpleJson()
        {
            if (!(Request.Form.Keys.Contains("textToConvert") || Request.Form.Keys.Contains("newLineSeparator")))
                return new BadRequestResult();

            var text = Request.Form["textToConvert"];
            var newLineSeparator = Request.Form["newLineSeparator"];

            text = text.ToString().Replace(newLineSeparator.ToString(), "\n");

            Parser parser = new Parser(text);

            var result = parser.parseCalendar();

            return new JsonResult(result);
            
        }
    }
}