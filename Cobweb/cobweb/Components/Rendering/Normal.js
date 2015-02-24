
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DNormalNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNormalNode, 
          X3DConstants)
{
	with (Fields)
	{
		function Normal (executionContext)
		{
			X3DNormalNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Normal);
		}

		Normal .prototype = $.extend (new X3DNormalNode (),
		{
			constructor: Normal,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "vector",   new MFVec3f ()),
			]),
			getTypeName: function ()
			{
				return "Normal";
			},
			getComponentName: function ()
			{
				return "Rendering";
			},
			getContainerField: function ()
			{
				return "normal";
			},
		});

		return Normal;
	}
});

