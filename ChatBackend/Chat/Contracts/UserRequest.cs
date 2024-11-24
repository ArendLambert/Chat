namespace Chat.Contracts
{
    public record UserRequest(
        string Name,
        string SessionId,
        string Password,
        string Email);
}
