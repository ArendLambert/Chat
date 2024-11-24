using Chat.Core.Models;

namespace Chat.Infrastructure
{
    public interface IJwtProvider
    {
        string GenerateToken(User user);
    }
}