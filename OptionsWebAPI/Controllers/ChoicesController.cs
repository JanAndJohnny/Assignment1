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
using OptionsWebSite.Models;

namespace OptionsWebAPI.Controllers
{
    public class ChoicesController : ApiController
    {
        private OptionContext db = new OptionContext();
        private ApplicationDbContext appDb = new ApplicationDbContext();


        public JToken getStuff()
        {
            JObject stuff = new JObject();
            stuff.Add("choiceData", JsonConvert.SerializeObject(db.Choices.ToList()));
            stuff.Add("optionData", JsonConvert.SerializeObject(db.Options.ToList()));
            return stuff;
        }

        // POST: api/Choices
        [HttpPost]
        [ResponseType(typeof(Choice))]
        public IHttpActionResult PostChoice(Choice choice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var choices = db.Choices.ToList();
            foreach(Choice tempChoice in choices)
            {
                if(tempChoice.YearTermId == choice.YearTermId && tempChoice.StudentId == choice.StudentId)
                {
                    var resp = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                    {
                        Content = new StringContent(string.Format("Student Already Made A Choice")),
                        ReasonPhrase = "Student Already Made A Choice"
                    };
                    throw new HttpResponseException(resp);
                }
            }

            db.Choices.Add(choice);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = choice.YearTermId }, choice);
        }

        [Route("api/Choices/registerJSONObject")]
        [HttpGet]
        public JToken registerJSONObject(){
            JObject stuff = new JObject();
            var YearTermList = db.YearTerms.ToList();
            var curYearTerm = new YearTerm();
            foreach(YearTerm yearTerm in YearTermList)
            {
                if (yearTerm.IsDefault)
                {
                    curYearTerm = yearTerm;
                    break;
                }
            }

            var optionList = db.Options.ToList();
            var validOptionsList = new List<Option>();

            foreach(Option option in optionList)
            {
                if (option.IsActive)
                {
                    validOptionsList.Add(option);
                }
            }

            var listUsers = appDb.Users.ToList();

            stuff.Add("validOptionsList", JsonConvert.SerializeObject(validOptionsList));
            stuff.Add("curYearTerm", JsonConvert.SerializeObject(curYearTerm));
            stuff.Add("listUsersUserName", JsonConvert.SerializeObject(listUsers));

            return stuff;
        }
    }
}

















