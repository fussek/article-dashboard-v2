using Microsoft.EntityFrameworkCore;
using backend.Data; // Ensure this is present

var builder = WebApplication.CreateBuilder(args);

// 1. Configure the database connection
builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy => {
        policy.WithOrigins("http://localhost:4200") 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .SetIsOriginAllowed(origin => true)
              .AllowCredentials();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApiDbContext>();
    context.Database.Migrate(); 
    DataSeeder.Seed(context);
}

// Enable Swagger in all environments (Development and Production)
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAngularApp");
app.UseAuthorization();
app.MapControllers();

var port = Environment.GetEnvironmentVariable("PORT") ?? "5193";
app.Run("http://0.0.0.0:" + port);
