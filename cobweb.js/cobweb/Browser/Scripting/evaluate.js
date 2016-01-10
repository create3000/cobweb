
define ("cobweb/Browser/Scripting/evaluate",
function ()
{
	return function (/* __global__, __text__ */)
	{
		with (arguments [0])
		{
			return eval (arguments [1]);
		}		
	};
});
