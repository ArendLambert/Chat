using Chat.Application.Services;
using Chat.Contracts;
using Chat.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;

namespace Chat.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;
        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<UsersResponse>>> GetUsers()
        {
            var users = await _usersService.GetAllUsers();

            var usersResponse = users.Select(x => new UsersResponse(x.Id, x.Name, x.SessionId, x.Password, x.Email));
            return Ok(usersResponse);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Guid>> CreateUser([FromBody] UserRequest request)
        {
            var (user, error) = Chat.Core.Models.User.Create(Guid.NewGuid(),
                                                             request.Name,
                                                             request.SessionId,
                                                             request.Password,
                                                             request.Email);
            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }
            var userId = await _usersService.CreateUser(user);
            return Ok(userId);
        }

        [HttpPut("{id:guid}")]
        [Authorize]
        public async Task<ActionResult<Guid>> UpdateUser(Guid id, [FromBody] UserRequest request)
        {
            var userId = await _usersService.UpdateUser(id, request.Name, request.SessionId, request.Password, request.Email);
            return Ok(userId);
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<ActionResult<Guid>> DeleteUser(Guid id)
        {
            var userId = await _usersService.DeleteUser(id);
            return Ok(userId);
        }

        [HttpGet("by-email")]
        public async Task<ActionResult<UsersResponse>> GetByEmail(string email)
        {
            var user = await _usersService.GetByEmail(email);
            var usersResponse = new UsersResponse(Guid.NewGuid(), "-1", "-1", "-1", "-1");
            if (user != null)
            {
                usersResponse = new UsersResponse(user.Id, user.Name, user.SessionId, user.Password, user.Email);
            }
            return Ok(usersResponse);
        }
    }
}
