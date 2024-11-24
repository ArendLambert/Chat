using Chat.Core.Models;

namespace Chat.Application.Services
{
    public interface IUsersService
    {
        Task<Guid> CreateUser(User user);
        Task<Guid> DeleteUser(Guid id);
        Task<List<User>> GetAllUsers();
        Task<Guid> UpdateUser(Guid id, string name, string sessionId, string password, string email);

        Task<User> GetByEmail(string email);
        Task<User> GetPasswordByEmail(string email);
    }
}