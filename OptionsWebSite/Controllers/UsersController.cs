﻿using Microsoft.AspNet.Identity.EntityFramework;
using OptionsWebSite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OptionsWebSite.Controllers
{
    public class UsersController : Controller
    {
        ApplicationDbContext db = new ApplicationDbContext();
        // GET: Users
        public ActionResult Index()
        {
            return View(db.Users.ToList());
        }

        // GET: Users/Edit/5
        public ActionResult Edit(string id)
        {
            if(id == "A00111111")
            {
                ViewBag.ResultMessage = "Cannot modify A00111111";
                return View("Index",db.Users.ToList());
            }
            var user = db.Users.Where(r => r.UserName.Equals(id, StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault();
            var listOfCurrentRoles = new List<string>();

            foreach(IdentityUserRole tempUserRole in user.Roles)
            {
                var roleId = tempUserRole.RoleId;
                foreach(IdentityRole tempUser in db.Roles)
                {
                    if(roleId == tempUser.Id)
                    {
                        listOfCurrentRoles.Add(tempUser.Name);
                    }
                }
            }
         

            var listRoles = db.Roles.ToList();
            List<SelectListItem> validRoles = new List<SelectListItem>();
            foreach (IdentityRole idR in listRoles)
            {
                SelectListItem temp = new SelectListItem
                {
                    Value = idR.Id,
                    Text = idR.Name
                };
                validRoles.Add(temp);
            }
            ViewBag.listOfCurrentRoles = listOfCurrentRoles;
            ViewBag.validRoles = validRoles;
            return View(user);
        }

        // POST: Users/Edit/5
        [HttpPost]
        public ActionResult Edit(string id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here
                var user = db.Users.Where(r => r.UserName.Equals(id, StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault();
                var role = new IdentityRole();

                foreach(IdentityUserRole tempUserRole in user.Roles)
                {
                    if(collection["validRoles"] == tempUserRole.RoleId)
                    {
                        ViewBag.ResultMessage = "Role already added to the user";
                        return View("Index", db.Users.ToList());
                    }
                }

                foreach (IdentityRole tempRole in db.Roles)
                {
                    if (collection["validRoles"] == tempRole.Id)
                    {
                        role = tempRole;
                    }
                }

                var idRole = new IdentityUserRole()
                {
                    UserId = user.Id,
                    RoleId = role.Id
                };
                user.Roles.Add(idRole);

                if (collection["LockoutEnabled"] == "true,false")
                {
                    user.LockoutEnabled = true;
                }
                else
                {
                    user.LockoutEnabled = false;
                }

                db.SaveChanges();
                return View("Index", db.Users.ToList());
            }
            catch
            {
                //ViewBag.ResultMessage = "ERROR";
                return View("Index", db.Users.ToList());
            }
        }

        // GET: Users/Delete/5
        public ActionResult Delete(string id,string username)
        {

            var user = db.Users.Where(r => r.UserName.Equals(username)).FirstOrDefault();

            var role = db.Roles.Where(r => r.Name.Equals(id)).FirstOrDefault();
            var userRole = new IdentityUserRole();

            foreach(IdentityUserRole tempIdRole in user.Roles)
            {
                if(tempIdRole.RoleId == role.Id)
                {
                    userRole = tempIdRole;
                    break;
                }
            }

            user.Roles.Remove(userRole);
            db.SaveChanges();
            ViewBag.ResultMessage = "User Deleted";
            return View("Index", db.Users.ToList());
        }
    }
}
