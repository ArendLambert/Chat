using Chat.Application.Services;
using Chat.Contracts;

namespace Chat.Endpoints
{
    public static class UserEndpoints
    {
        public static IEndpointRouteBuilder MapUsersEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("register", Register);
            app.MapPost("login", Login);
            return app;
        }

        private static async Task<IResult> Register(UsersService usersService, UserRequest request)
        {
            await usersService.Register(request.Name, request.SessionId, request.Password, request.Email);
            return Results.Ok();
        }

        private static async Task<IResult> Login(UsersService usersService, UserLoginRequest request, HttpContext context)
        {
            var token = await usersService.Login(request.Email, request.Password);

            context.Response.Cookies.Append("something", token);
            Console.WriteLine($"SUCCESS: {token}");

            return Results.Ok(token);
        }
    }
}
