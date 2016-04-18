
define ("cobweb/Components/Layout/ScreenGroup",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Geometry/ViewVolume",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DConstants,
          Vector3,
          Rotation4,
          Matrix4,
          ViewVolume,
          Algorithm)
{
"use strict";

	var
		translation = new Vector3 (0, 0, 0),
		rotation    = new Rotation4 (0, 0, 1, 0),
		scale       = new Vector3 (1, 1, 1),
		screenPoint = new Vector3 (0, 0, 0);

	function ScreenGroup (executionContext)
	{
		X3DGroupingNode .call (this, executionContext);

		this .addType (X3DConstants .ScreenGroup);

		this .screenMatrix       = new Matrix4 ();
		this .modelViewMatrix    = new Matrix4 ();
		this .invModelViewMatrix = new Matrix4 ();
	}

	ScreenGroup .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
	{
		constructor: ScreenGroup,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "ScreenGroup";
		},
		getComponentName: function ()
		{
			return "Layout";
		},
		getContainerField: function ()
		{
			return "children";
		},
		getBBox: function (bbox)
		{
			return X3DGroupingNode .prototype .getBBox .call (this, bbox) .multRight (this .getMatrix ());
		},
		getMatrix: function ()
		{
			try
			{
				this .invModelViewMatrix .assign (this .modelViewMatrix) .inverse ();
				this .matrix .assign (this .screenMatrix) .multRight (this .invModelViewMatrix);
			}
			catch (error)
			{ }

			return this .matrix;
		},
		scale: function (type)
		{
			this .getModelViewMatrix (type, this .modelViewMatrix);
			this .modelViewMatrix .get (translation, rotation, scale);
		
			var
				projectionMatrix = this .getBrowser () .getProjectionMatrix (),
				viewport         = this .getCurrentLayer () .getViewVolume () .getViewport (),
				screenScale      = this .getCurrentViewpoint () .getScreenScale (translation, viewport);
		
			this .screenMatrix .set (translation, rotation, scale .set (screenScale .x * (Algorithm .signum (scale .x) < 0 ? -1 : 1),
		                                                               screenScale .y * (Algorithm .signum (scale .y) < 0 ? -1 : 1),
		                                                               screenScale .z * (Algorithm .signum (scale .z) < 0 ? -1 : 1)));

			// Snap to whole pixel

			ViewVolume .projectPoint (Vector3 .Zero, this .screenMatrix, projectionMatrix, viewport, screenPoint);

			screenPoint .x = Math .round (screenPoint .x);
			screenPoint .y = Math .round (screenPoint .y);

			ViewVolume .unProjectPoint (screenPoint .x, screenPoint .y, screenPoint .z, this .screenMatrix, projectionMatrix, viewport, screenPoint);

			screenPoint .z = 0;
			this .screenMatrix .translate (screenPoint);

			// Assign modelViewMatrix

			this .getBrowser () .getModelViewMatrix () .set (this .screenMatrix);
		},
		traverse: function (type)
		{
			try
			{
				var modelViewMatrix = this .getBrowser () .getModelViewMatrix ();
		
				modelViewMatrix .push ();
			
				this .scale (type);
			
				X3DGroupingNode .prototype .traverse .call (this, type);
			
				modelViewMatrix .pop ();
			}
			catch (error)
			{ }
		},
	});

	return ScreenGroup;
});


