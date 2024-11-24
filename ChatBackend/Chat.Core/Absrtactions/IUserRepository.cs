using Chat.Core.Models;

namespace Chat.DataAccess.Repositories
{
    public interface IUserRepository
    {
        Task<Guid> Create(User user);
        Task<Guid> Delete(Guid id);
        Task<List<User>> Get();
        Task<Guid> Update(Guid id, string name, string sessionId, string password, string email);
        Task<User> GetByEmail(string email);
        Task<User> GetPasswordByEmail(string email);
    }
}