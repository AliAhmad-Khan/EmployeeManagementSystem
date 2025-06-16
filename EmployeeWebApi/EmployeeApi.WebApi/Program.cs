using EmployeeApi.Application.Interfaces;
using EmployeeApi.Application.Mappings;
using EmployeeApi.Application.Services;
using EmployeeApi.Domain.Interfaces;
using EmployeeApi.Infrastructure.Data;
using EmployeeApi.Infrastructure.Repositories;
using EmployeeApi.WebApi.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("EmployeeDb"));

// AutoMapper
builder.Services.AddAutoMapper(
    cfg => { /* no custom config here */ },
    typeof(EmployeeMappingProfile).Assembly
);
// Repositories & Services
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

// Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Employee API V1");
        c.RoutePrefix = string.Empty;
    });
}

// Add Middleware
app.UseMiddleware<ExceptionMiddleware>();

// seed data
//using (var scope = app.Services.CreateScope())
//{
//    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

//    // For InMemory, dropping and re-creating ensures we start fresh
//    context.Database.EnsureDeleted();
//    context.Database.EnsureCreated();

//    SeedData.Initialize(context);
//}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
