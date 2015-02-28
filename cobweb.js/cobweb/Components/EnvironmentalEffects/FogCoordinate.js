
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometricPropertyNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometricPropertyNode, 
          X3DConstants)
{
	with (Fields)
	{
		function FogCoordinate (executionContext)
		{
			X3DGeometricPropertyNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .FogCoordinate);
		}

		FogCoordinate .prototype = $.extend (new X3DGeometricPropertyNode (),
		{
			constructor: FogCoordinate,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "depth",    new MFFloat ()),
			]),
			getTypeName: function ()
			{
				return "FogCoordinate";
			},
			getComponentName: function ()
			{
				return "EnvironmentalEffects";
			},
			getContainerField: function ()
			{
				return "fogCoord";
			},
		});

		return FogCoordinate;
	}
});

