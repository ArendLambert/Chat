namespace Chat.Contracts
{
    public record UsersResponse(
        Guid Id,
        string Name,
        string SessionId,
        string Password,
        string Email);
}
