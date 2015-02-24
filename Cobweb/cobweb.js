
require (["cobweb/X3D"],
function (X3D)
{
	X3D (function ()
	{
		var Browser = X3D .getBrowser ($("X3D"));

		Browser .print ("Welcome to " + Browser .name + " X3D Browser " + Browser .version + ":");
	});
});
