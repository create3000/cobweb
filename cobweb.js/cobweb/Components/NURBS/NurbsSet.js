
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DBoundedObject, 
          X3DConstants)
{
	with (Fields)
	{
		function NurbsSet (executionContext)
		{
			X3DChildNode .call (this, executionContext .getBrowser (), executionContext);
			X3DBoundedObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .NurbsSet);
		}

		NurbsSet .prototype = $.extend (Object .create (X3DChildNode .prototype),new X3DBoundedObject (),
		{
			constructor: NurbsSet,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",          new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",        new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addGeometry",       new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeGeometry",    new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "geometry",          new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tessellationScale", new SFFloat (1)),
			]),
			getTypeName: function ()
			{
				return "NurbsSet";
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

		return NurbsSet;
	}
});

