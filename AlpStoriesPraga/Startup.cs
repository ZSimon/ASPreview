using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AlpStoriesPraga.Startup))]
namespace AlpStoriesPraga
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
