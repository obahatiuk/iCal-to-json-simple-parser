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
    [Route("api/[controller]")]
    [ApiController]
    public class iCalParserController : ControllerBase
    {
        [HttpPost("[action]")]
        public JsonResult ConvertiCalToSimpleJson()
        {
            //var filesToProvide =  Request.Body;
            var files = Request.Form.Files;

            if (files.Count == 0)
                return new JsonResult(new { result = "Something went wrong" });

            using (StreamReader file = new StreamReader(files[0].OpenReadStream()))
            {
                var content = "";
                string ln = "";
                var startReading = false;
                while ((ln = file.ReadLine()) != null)
                {
                    content += ln + "\n";
                }

                Parser parser = new Parser(content);

                var result = parser.parseCalendar();

                return new JsonResult(result);
            }
        }


        [HttpGet("[action]")]
        public void Test()
        {
            var x = 0;
        }
    }
}