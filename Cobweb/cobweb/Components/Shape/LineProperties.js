
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DAppearanceChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DAppearanceChildNode, 
          X3DConstants)
{
	with (Fields)
	{
		function LineProperties (executionContext)
		{
			X3DAppearanceChildNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .LineProperties);
		}

		LineProperties .prototype = $.extend (new X3DAppearanceChildNode (),
		{
			constructor: LineProperties,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",             new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "applied",              new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "linetype",             new SFInt32 (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "linewidthScaleFactor", new SFFloat ()),
			]),
			getTypeName: function ()
			{
				return "LineProperties";
			},
			getComponentName: function ()
			{
				return "Shape";
			},
			getContainerField: function ()
			{
				return "lineProperties";
			},
		});

		return LineProperties;
	}
});

