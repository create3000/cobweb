
require (["cobweb/X3D"],
function (X3D)
{
	var callbacks = window .X3D .callbacks;

	window .X3D = X3D; // Now assign real X3D.

	X3D (); // Initialize all X3D tags

	for (var i = 0; i < callbacks .length; ++ i)
	   X3D (callbacks [i]);
});

// Temporary X3D before page load.
if (! window .X3D)
{
	window .X3D = (function ()
	{
		function X3D (callback)
		{
		   X3D .callbacks .push (callback);
		};

		X3D .callbacks = [ ];

		return X3D;
	}) ();
}
