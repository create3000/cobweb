
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
		function Polypoint2D (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Polypoint2D);
		}

		Polypoint2D .prototype = $.extend (new X3DGeometryNode (),
		{
			constructor: Polypoint2D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "point",    new MFVec2f ()),
			]),
			getTypeName: function ()
			{
				return "Polypoint2D";
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

		return Polypoint2D;
	}
});

