namespace Chat.Contracts
{
    public record UserLoginRequest(
        string Email,
        string Password);
}
