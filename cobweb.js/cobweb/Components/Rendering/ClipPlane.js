
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DConstants)
{
	with (Fields)
	{
		function ClipPlane (executionContext)
		{
			X3DChildNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ClipPlane);
		}

		ClipPlane .prototype = $.extend (new X3DChildNode (),
		{
			constructor: ClipPlane,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",  new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "plane",    new SFVec4f (0, 1, 0, 0)),
			]),
			getTypeName: function ()
			{
				return "ClipPlane";
			},
			getComponentName: function ()
			{
				return "Rendering";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return ClipPlane;
	}
});

