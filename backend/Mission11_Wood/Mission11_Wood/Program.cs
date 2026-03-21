using Microsoft.EntityFrameworkCore;
using Mission11_Wood.Data;

var builder = WebApplication.CreateBuilder(args);

// Register MVC-style API controllers (e.g. BookstoreController).
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Wire EF Core to the Bookstore SQLite file from appsettings (connection string "BookConnection").
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookConnection")));

// CORS so the React dev server can call this API from the browser.
builder.Services.AddCors();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Allow requests from the Vite/React app origin.
app.UseCors(x => x.WithOrigins("http://localhost:3000"));

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();