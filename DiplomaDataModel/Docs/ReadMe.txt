﻿enable-migrations -ContextTypeName OptionContext -MigrationsDirectory Migrations\OptionContext

add-migration -ConfigurationTypeName OptionsWebSite.Migrations.OptionContext.Configuration "InitialCreate"

update-database -ConfigurationTypeName OptionsWebSite.Migrations.OptionContext.Configuration