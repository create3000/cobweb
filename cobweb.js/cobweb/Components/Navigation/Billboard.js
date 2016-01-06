
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DConstants,
          Vector3,
          Rotation4,
          Matrix4)
{
"use strict";

	var
	   inverseModelViewMatrix = new Matrix4 (),
		yAxis                  = new Vector3 (0, 1, 0),
		zAxis                  = new Vector3 (0, 0, 1),
		viewerYAxis            = new Vector3 (0, 0, 0),
		x                      = new Vector3 (0, 0, 0),
		y                      = new Vector3 (0, 0, 0),
		N1                     = new Vector3 (0, 0, 0),
		N2                     = new Vector3 (0, 0, 0),
		rotation               = new Rotation4 (0, 0, 1, 0);

	function Billboard (executionContext)
	{
		X3DGroupingNode .call (this, executionContext);

		this .addType (X3DConstants .Billboard);
		
		this .matrix = new Matrix4 ();
	}

	Billboard .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
	{
		constructor: Billboard,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "axisOfRotation", new Fields .SFVec3f (0, 1, 0)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "Billboard";
		},
		getComponentName: function ()
		{
			return "Navigation";
		},
		getContainerField: function ()
		{
			return "children";
		},
		rotate: function (type)
		{
			try
			{
				this .getModelViewMatrix (type, inverseModelViewMatrix) .inverse ();

				var billboardToViewer = inverseModelViewMatrix .origin .normalize (); // Normalized to get work with Geo

				if (this .axisOfRotation_ .getValue () .equals (Vector3 .Zero))
				{
					inverseModelViewMatrix .multDirMatrix (viewerYAxis .assign (yAxis)) .normalize (); // Normalized to get work with Geo

					x .assign (viewerYAxis) .cross (billboardToViewer);
					y .assign (billboardToViewer) .cross (x);
					var z = billboardToViewer;

					// Compose rotation

					x .normalize ();
					y .normalize ();

					this .matrix .set (x [0], x [1], x [2], 0,
					                   y [0], y [1], y [2], 0,
					                   z [0], z [1], z [2], 0,
					                   0,     0,     0,     1);
				}
				else
				{
					N1 .assign (this .axisOfRotation_ .getValue ()) .cross (billboardToViewer); // Normal vector of plane as in specification
					N2 .assign (this .axisOfRotation_ .getValue ()) .cross (zAxis);             // Normal vector of plane between axisOfRotation and zAxis

					this .matrix .setRotation (rotation .setFromToVec (N2, N1));                // Rotate zAxis in plane
				}

				this .getBrowser () .getModelViewMatrix () .multLeft (this .matrix);
			}
			catch (error)
			{ }
		},
		traverse: function (type)
		{
			this .getBrowser () .getModelViewMatrix () .push ();
			this .rotate (type);

			X3DGroupingNode .prototype .traverse .call (this, type);

			this .getBrowser () .getModelViewMatrix () .pop ();
		},
	});

	return Billboard;
});


