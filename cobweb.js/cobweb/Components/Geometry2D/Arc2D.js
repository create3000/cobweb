
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
		function Arc2D (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Arc2D);
		}

		Arc2D .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
		{
			constructor: Arc2D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "startAngle", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "endAngle",   new SFFloat (1.5708)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "radius",     new SFFloat (1)),
			]),
			getTypeName: function ()
			{
				return "Arc2D";
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

		return Arc2D;
	}
});

