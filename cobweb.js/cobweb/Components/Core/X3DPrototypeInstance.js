
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DNode, 
          X3DConstants)
{
	function X3DPrototypeInstance (executionContext, proto)
	{
		X3DNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .X3DPrototypeInstance);

		this .setExtendedEventHandling (false);

		this .proto = proto;
	}

	X3DPrototypeInstance .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: X3DPrototypeInstance,
		getTypeName: function ()
		{
			return this .proto .getName ();
		},
		getComponentName: function ()
		{
			return "Core";
		},
		getContainerField: function ()
		{
			return "children";
		},
	});

	return X3DPrototypeInstance;
});

