﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using DiplomaDataModel.Option;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Web.Http.Cors;

namespace OptionsWebAPI.Controllers
{
    [EnableCors("*", "*", "*")]
    public class ChoicesController : ApiController
    {
        private OptionContext db = new OptionContext();


        public JToken getStuff()
        {
            JObject stuff = new JObject();
            stuff.Add("choiceData", JsonConvert.SerializeObject(db.Choices.ToList()));
            stuff.Add("optionData", JsonConvert.SerializeObject(db.Options.ToList()));
            return stuff;
        }


    }
}

















