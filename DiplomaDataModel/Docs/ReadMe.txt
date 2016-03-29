enable-migrations -ContextProjectName DiplomaDataModel -ContextTypeName ApplicationDbContext -MigrationsDirectory Migrations\FinalIdentityMigrations

<<<<<<< HEAD
add-migration -ConfigurationTypeName OptionsWebSite.Migrations.OptionsMigrations.Configuration "Adding More Users Part 3"
=======
add-migration -ConfigurationTypeName OptionsWebSite.Migrations.OptionsMigrations.Configuration "Adding More Users"
>>>>>>> 960455027a41dcdccd74ee0877e79b402f5e4d3f

update-database -ConnectionStringName DefaultConnection -ConfigurationTypeName OptionsWebSite.Migrations.FinalIdentityMigrations.Configuration