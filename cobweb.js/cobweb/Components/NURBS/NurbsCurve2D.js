
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/NURBS/X3DNurbsControlCurveNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNurbsControlCurveNode, 
          X3DConstants)
{
	with (Fields)
	{
		function NurbsCurve2D (executionContext)
		{
			X3DNurbsControlCurveNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .NurbsCurve2D);
		}

		NurbsCurve2D .prototype = $.extend (Object .create (X3DNurbsControlCurveNode .prototype),
		{
			constructor: NurbsCurve2D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tessellation", new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "closed",       new SFBool ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "order",        new SFInt32 (3)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "knot",         new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "weight",       new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "controlPoint", new MFVec2d ()),
			]),
			getTypeName: function ()
			{
				return "NurbsCurve2D";
			},
			getComponentName: function ()
			{
				return "NURBS";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return NurbsCurve2D;
	}
});

