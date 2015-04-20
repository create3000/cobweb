
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Layering/X3DViewportNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/ViewVolume",
	"standard/Math/Numbers/Vector4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DViewportNode, 
          X3DConstants,
          ViewVolume,
          Vector4)
{
	with (Fields)
	{
		function Viewport (executionContext)
		{
			X3DViewportNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Viewport);
		}

		Viewport .prototype = $.extend (Object .create (X3DViewportNode .prototype),
		{
			constructor: Viewport,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "clipBoundary",   new MFFloat (0, 1, 0, 1)),
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
			initialize: function ()
			{
				X3DViewportNode .prototype .initialize .call (this);
				
				this .getBrowser () .getViewport () .addInterest (this, "set_rectangle__");
				this .clipBoundary_                 .addInterest (this, "set_rectangle__");

				this .set_rectangle__ ();
			},
			set_rectangle__: function ()
			{
				var viewport = this .getBrowser () .getViewport ();

				var left   = Math .floor (viewport [2] * this .getLeft ());
				var right  = Math .floor (viewport [2] * this .getRight ());
				var bottom = Math .floor (viewport [3] * this .getBottom ());
				var top    = Math .floor (viewport [3] * this .getTop ());

				this .rectangle = new Vector4 (left,
				                               bottom,
				                               Math .max (0, right - left),
				                               Math .max (0, top - bottom));
			},
			getRectangle: function ()
			{
				return this .rectangle;
			},
			getLeft: function ()
			{
				return this .clipBoundary_ .length > 0 ? this .clipBoundary_ [0] : 0;
			},
			getRight: function ()
			{
				return this .clipBoundary_ .length > 1 ? this .clipBoundary_ [1] : 1;
			},
			getBottom: function ()
			{
				return this .clipBoundary_ .length > 2 ? this .clipBoundary_ [2] : 0;
			},
			getTop: function ()
			{
				return this .clipBoundary_ .length > 3 ? this .clipBoundary_ [3] : 1;
			},
			traverse: function (type)
			{
				this .push ();

				switch (type)
				{
					case TraverseType .POINTER:
					{
						var
							viewVolumes = this .getCurrentLayer () .getViewVolumeStack (),
							viewVolume  = viewVolumes [viewVolumes .length - 1];

						if (! this .getBrowser () .isPointerInRectangle (viewVolume .getScissor ()))
							return;

						X3DGroupingNode .prototype .traverse .call (this, type);
						break;
					}
					default:
						X3DGroupingNode .prototype .traverse .call (this, type);
						break;
				}

				this .pop ();
			},
			push: function ()
			{
				var viewVolumes = this .getCurrentLayer () .getViewVolumeStack ();
				var viewport    = viewVolumes .length ? viewVolumes [0] .getViewport () : this .rectangle;

				this .getCurrentLayer () .getViewVolumeStack () .push (new ViewVolume (this .getBrowser () .getProjectionMatrix (),
				                                                                   viewport,
				                                                                   this .rectangle));
			},
			pop: function ()
			{
				this .getCurrentLayer () .getViewVolumeStack () .pop ();
			},
		});

		return Viewport;
	}
});

