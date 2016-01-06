
define ([
	"jquery",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          X3DSensorNode, 
          X3DConstants,
          Vector4,
          Matrix4)
{
"use strict";

	function X3DPointingDeviceSensorNode (executionContext)
	{
		X3DSensorNode .call (this, executionContext);

		this .addType (X3DConstants .X3DPointingDeviceSensorNode);
	}

	X3DPointingDeviceSensorNode .prototype = $.extend (Object .create (X3DSensorNode .prototype),
	{
		constructor: X3DPointingDeviceSensorNode,
		initialize: function ()
		{
			X3DSensorNode .prototype .initialize .call (this);

			this .enabled_ .addInterest (this, "set_enabled__");

			this .matrices = { };
		},
		getMatrices: function ()
		{
			return this .matrices;
		},
		set_enabled__: function ()
		{
			if (this .enabled_ .getValue ())
				return;

			if (this .isActive_ .getValue ())
				this .isActive_ = false;

			if (this .isOver_ .getValue ())
				this .isOver_ = false;
		},
		set_over__: function (hit, value)
		{
			if (value !== this .isOver_ .getValue ())
			{
				this .isOver_ = value;

				if (this .isOver_ .getValue ())
					this .getBrowser () .getNotification () .string_ = this .description_;
			}
		},
		set_active__: function (hit, value)
		{
			if (value !== this .isActive_ .getValue ())
				this .isActive_ = value;
		},
		traverse: function (sensors)
		{
			if (this .enabled_ .getValue ())
			{
				var currentLayer = this .getCurrentLayer ();

				sensors [this .getId ()] = this;

				// Create a matrix set for each layer if needed in the case the sensor is cloned over multiple layers.

				if (! (currentLayer .getId () in this .matrices))
				{
					this .matrices [currentLayer .getId ()] = {
						modelViewMatrix:  new Matrix4 (),
						projectionMatrix: new Matrix4 (),
						viewport:         new Vector4 (),
					};
				}

				var matrices = this .matrices [currentLayer .getId ()];

				matrices .modelViewMatrix .assign (this .getBrowser () .getModelViewMatrix () .get ());
				matrices .projectionMatrix .assign (this .getBrowser () .getProjectionMatrix ());
				matrices .viewport .assign (currentLayer .getViewport () .getRectangle ());
			}
		},
	});

	return X3DPointingDeviceSensorNode;
});


