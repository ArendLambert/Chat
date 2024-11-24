using Chat.Application.Services;
using Chat.DataAccess;
using Chat.Application;
using Microsoft.EntityFrameworkCore;
using Chat.DataAccess.Repositories;
using Chat.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Chat.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Chat.Extensions;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic.FileIO;
using Microsoft.AspNetCore.CookiePolicy;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(nameof(JwtOptions)));
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddDbContext<ChatDbContext>(
            options =>
            {
                options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(ChatDbContext)));
            });
        builder.Services.AddApiAuthentifications(builder.Services.BuildServiceProvider().GetRequiredService<IOptions<JwtOptions>>());
        builder.Services.AddScoped<IUsersService, UsersService>();
        builder.Services.AddScoped<IFriendPairService, FriendPairService>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IFriendRepository, FriendRepository>();
        builder.Services.AddScoped<IJwtProvider, JwtProvider>();
        builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
        builder.Services.AddScoped<UsersService>();
        //ApiExtensions.AddApiAuthentifications(services: builder.Services, JwtOptions);
        var app = builder.Build();
        app.UseCors("AllowSpecificOrigin");
        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseCors(x =>
        {
            x.WithOrigins("http://localhost:3000")
             .AllowAnyHeader()
             .AllowAnyMethod()
             .AllowCredentials();
        });

        app.MapControllers();
        app.MapUsersEndpoints();

        app.UseCookiePolicy(new CookiePolicyOptions
        {
            MinimumSameSitePolicy = SameSiteMode.None,
            HttpOnly = HttpOnlyPolicy.None,
            Secure = CookieSecurePolicy.Always
        });

        app.UseAuthentication(); // Важно: должно быть перед UseAuthorization
        app.UseAuthorization();

        app.Run();
    }
}
