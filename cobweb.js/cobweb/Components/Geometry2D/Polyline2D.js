
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants)
{
	with (Fields)
	{
		function Polyline2D (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Polyline2D);
		}

		Polyline2D .prototype = $.extend (new X3DGeometryNode (),
		{
			constructor: Polyline2D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "lineSegments", new MFVec2f ()),
			]),
			getTypeName: function ()
			{
				return "Polyline2D";
			},
			getComponentName: function ()
			{
				return "Geometry2D";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
		});

		return Polyline2D;
	}
});

