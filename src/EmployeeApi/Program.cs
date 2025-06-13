using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using EmployeeApi.Infrastructure;
using EmployeeApi.Domain;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore;          // Added for Swagger extensions
using Swashbuckle.AspNetCore.SwaggerGen; // Added for AddSwaggerGen
using Swashbuckle.AspNetCore.SwaggerUI;  // Added for UseSwaggerUI

var builder = WebApplication.CreateBuilder(args);

// Add In-Memory DB
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("EmployeeDb"));

// Add controllers and swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Employee API", Version = "v1" });
});

builder.Services.AddCors(options =>
    options.AddPolicy("AllowReactDev", p =>
        p.AllowAnyOrigin()
         .AllowAnyMethod()
         .AllowAnyHeader()
));

var app = builder.Build();

app.UseCors("AllowReactDev");

// Seed data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Employees.Add(new Employee { Id = Guid.NewGuid(), Name = "Alice", Email = "alice@example.com", DateOfBirth = new DateTime(1990,1,1), Department = "HR" });
    db.SaveChanges();
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Employee API V1");
});

app.UseAuthorization();

app.MapControllers();

app.Run();
