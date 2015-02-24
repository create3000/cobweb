
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Layering/X3DViewportNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DViewportNode, 
          X3DConstants)
{
	with (Fields)
	{
		function Viewport (executionContext)
		{
			X3DViewportNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Viewport);
		}

		Viewport .prototype = $.extend (new X3DViewportNode (),
		{
			constructor: Viewport,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "clipBoundary",   new MFFloat ([, 0,, 1,, 0,, 1, ])),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "Viewport";
			},
			getComponentName: function ()
			{
				return "Layering";
			},
			getContainerField: function ()
			{
				return "viewport";
			},
			getRectangle: function ()
			{
				return this .getBrowser () .getViewport ();
			},
			push: function (type)
			{
			
			},
			pop: function (type)
			{
			
			},
		});

		return Viewport;
	}
});

