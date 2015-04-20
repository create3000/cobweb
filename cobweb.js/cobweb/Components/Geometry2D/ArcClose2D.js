
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
		function ArcClose2D (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ArcClose2D);
		}

		ArcClose2D .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
		{
			constructor: ArcClose2D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "closureType", new SFString ("PIE")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "startAngle",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "endAngle",    new SFFloat (1.5708)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "radius",      new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",       new SFBool (true)),
			]),
			getTypeName: function ()
			{
				return "ArcClose2D";
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

		return ArcClose2D;
	}
});

